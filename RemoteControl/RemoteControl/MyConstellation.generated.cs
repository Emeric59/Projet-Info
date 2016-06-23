﻿// ------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by the Constellation SDK Code Generator.
//     Generator Version: 1.8.0.16088
//  
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
// ------------------------------------------------------------------------------

using Constellation;
using Constellation.Package;
using System.Threading;
using System.Threading.Tasks;

namespace RemoteControl
{
    /// <summary>
    /// Represents your Constellation
    /// </summary>
	public static class MyConstellation
	{
		/// <summary>
		/// Specifies the sentinels in your Constellation
		/// </summary>
		public enum Sentinels
		{
			/// <summary>
            /// Sentinel 'PC-EMERIC'
            /// </summary>
			[RealName("PC-EMERIC")]
			PC_EMERIC,
		}

		/// <summary>
		/// Specifies the package's instances in your Constellation
		/// </summary>
		public enum PackageInstances
		{
			/// <summary>
            /// Package 'Pushbullet' on 'PC-EMERIC'
            /// </summary>
			[RealName("PC-EMERIC/Pushbullet")]
			PC_EMERIC_Pushbullet,
		}
		
		/// <summary>
		/// Specifies the packages in your Constellation
		/// </summary>
		public enum Packages
		{
			/// <summary>
            /// Package 'Pushbullet'
            /// </summary>
			[RealName("Pushbullet")]
			Pushbullet,
		}
    
		/// <summary>
        /// Creates the message scope to the specified sentinel.
        /// </summary>
        /// <param name="sentinel">The sentinel.</param>
        /// <returns>MessageScope</returns>
		public static MessageScope CreateScope(this Sentinels sentinel)
		{
		    return MessageScope.Create(MessageScope.ScopeType.Sentinel, sentinel.GetRealName());
		}    
		
		/// <summary>
        /// Creates the message scope to the specified package's instance.
        /// </summary>
        /// <param name="package">The package's instance.</param>
        /// <returns>MessageScope</returns>
		public static MessageScope CreateScope(this PackageInstances package)
		{
		    return MessageScope.Create(MessageScope.ScopeType.Package, package.GetRealName());      
		} 
		
		/// <summary>
        /// Creates the message scope to the specified package.
        /// </summary>
        /// <param name="package">The package.</param>
        /// <returns>MessageScope</returns>
		public static MessageScope CreateScope(this Packages package)
		{
		    return MessageScope.Create(MessageScope.ScopeType.Package, package.GetRealName());        
		}
	}
	
	/// <summary>
    /// Specifies the real name of an enum value.
    /// </summary>
    /// <seealso cref="System.Attribute" />
	[System.AttributeUsage(System.AttributeTargets.Field)]
	public class RealNameAttribute : System.Attribute
	{
	    /// <summary>
        /// Gets or sets the real name.
        /// </summary>
        /// <value>
        /// The real name.
        /// </value>
		public System.String RealName { get; set; }

		/// <summary>
        /// Initializes a new instance of the <see cref="RealNameAttribute"/> class.
        /// </summary>
        /// <param name="realname">The real name.</param>
		public RealNameAttribute(System.String realname)
		{
			this.RealName = realname;
		}
		
	    /// <summary>
        /// Gets the real name of an enum value.
        /// </summary>
        /// <typeparam name="TEnum">The type of the enum.</typeparam>
        /// <param name="value">The enum value.</param>
        /// <returns>The real name.</returns>
		public static string GetRealName<TEnum>(TEnum value)
		{
			var memInfo = typeof(TEnum).GetMember(value.ToString());
			var attributes = memInfo[0].GetCustomAttributes(typeof(RealNameAttribute), false);
			return (attributes != null && attributes.Length > 0) ? ((RealNameAttribute)attributes[0]).RealName : value.ToString();
		}
	}

	/// <summary>
    /// Provides extension methods to get the real name of a Sentinel, Package or PackageInstance.
    /// </summary>
	public static class RealNameExtension
	{
		public static string GetRealName(this MyConstellation.Sentinels sentinel)
		{
			return RealNameAttribute.GetRealName<MyConstellation.Sentinels>(sentinel);
		}

		public static string GetRealName(this MyConstellation.Packages package)
		{
			return RealNameAttribute.GetRealName<MyConstellation.Packages>(package);
		}

		public static string GetRealName(this MyConstellation.PackageInstances package)
		{
			return RealNameAttribute.GetRealName<MyConstellation.PackageInstances>(package);
		}
	}
}


namespace RemoteControl.PushBullet.MessageCallbacks
{
	/// <summary>
	/// Type 'SendPushRequest'
	/// </summary>
	public class SendPushRequest 
	{
		/// <summary>
		/// The Iden.
		/// </summary>
		public System.String Iden { get; set; }

		/// <summary>
		/// The Title.
		/// </summary>
		public System.String Title { get; set; }

		/// <summary>
		/// The Message.
		/// </summary>
		public System.String Message { get; set; }

	}

	/// <summary>
	/// Provides extension methods for the MessageScope to PushBullet
	/// </summary>
	public static class PushBulletExtensions
	{
		/// <summary>
		/// Create a PushBulletScope
		/// </summary>
		/// <param name="scope">The Constellation MessageScope</param>
		public static PushBulletScope ToPushBulletScope(this MessageScope scope)
		{
			return new PushBulletScope(scope);
		}

		/// <summary>
		/// Create a PushBulletScope to all packages of the specified sentinel
		/// </summary>
		/// <param name="sentinel">The sentinel</param>
		public static PushBulletScope CreatePushBulletScope(this RemoteControl.MyConstellation.Sentinels sentinel)
		{
		    return MessageScope.Create(MessageScope.ScopeType.Sentinel, sentinel.GetRealName()).ToPushBulletScope();        
		}
		
		/// <summary>
		/// Create a PushBulletScope to a specific package
		/// </summary>
		/// <param name="package">The package</param>
		public static PushBulletScope CreatePushBulletScope(this RemoteControl.MyConstellation.PackageInstances package)
		{
		    return MessageScope.Create(MessageScope.ScopeType.Package, package.GetRealName()).ToPushBulletScope();        
		}
		
		/// <summary>
		/// Create a PushBulletScope to a specific package
		/// </summary>
		/// <param name="package">The package</param>
		public static PushBulletScope CreatePushBulletScope(this RemoteControl.MyConstellation.Packages package)
		{
		    return MessageScope.Create(MessageScope.ScopeType.Package, package.GetRealName()).ToPushBulletScope();  
		}
	}

	/// <summary>
    /// Represent a message scope to PushBullet
    /// </summary>
	public class PushBulletScope
	{
        /// <summary>
        /// The current scope
        /// </summary>
		private MessageScope currentScope = null;

		/// <summary>
        /// Initializes a new instance of the <see cref="PushBulletScope"/> class.
        /// </summary>
        /// <param name="scope">The scope.</param>
		public PushBulletScope(MessageScope scope)
		{
			this.currentScope = scope;
		}

		/// <summary>
		/// Send message 'SendPush' to the current scope
		/// </summary>
		/// <param name="request">The 'request' parameter</param>
		public void SendPush(SendPushRequest request)
		{
			this.currentScope.GetProxy().SendPush(request);
		}
	}
}
